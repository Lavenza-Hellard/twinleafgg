import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage, PlayerType, ChooseAttackPrompt, Player, EnergyMap } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect, CheckAttackCostEffect } from '../../game/store/effects/check-effects';

export class ShiningCelebi extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = G;

  public hp: number = 70;

  public weakness = [{ type: R }];

  public retreat = [C];

  public powers = [{
    name: 'Time Recall',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Each of your evolved Pokémon can use any attack from its previous Evolutions. (You still need the necessary Energy to use each attack.)'
  }];

  public attacks = [{ name: 'Leaf Step', cost: [G, C], damage: 30, text: '' }];

  public set: string = 'SMP';

  public setNumber = '79';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Shining Celebi';

  public fullName: string = 'Shining Celebi SMP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard === this || pokemonCard?.stage === Stage.BASIC) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Build cards and blocked for Choose Attack prompt
      const { pokemonCards, blocked } = this.buildAttackList(state, store, player);

      // No attacks to copy
      if (pokemonCards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ChooseAttackPrompt(
        player.id,
        GameMessage.CHOOSE_ATTACK_TO_COPY,
        pokemonCards,
        { allowCancel: true, blocked }
      ), attack => {
        if (attack !== null) {
          const useAttackEffect = new UseAttackEffect(player, attack);
          store.reduceEffect(state, useAttackEffect);
        }
      });
    }

    return state;
  }

  private buildAttackList(
    state: State, store: StoreLike, player: Player
  ): { pokemonCards: PokemonCard[], blocked: { index: number, attack: string }[] } {

    const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
    store.reduceEffect(state, checkProvidedEnergyEffect);
    const energyMap = checkProvidedEnergyEffect.energyMap;

    const pokemonCards: PokemonCard[] = [];
    const blocked: { index: number, attack: string }[] = [];

    player.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
      if (cardList === player.active && player.active.getPokemonCard() !== undefined) {
        const pokemons = cardList.getPokemons();
        this.checkAttack(state, store, player, pokemons.slice(0)[0], energyMap, pokemonCards, blocked);
        if (player.active.getPokemonCard()?.stage === Stage.STAGE_2 && pokemons.slice(1)[0].stage !== Stage.STAGE_2) {
          this.checkAttack(state, store, player, pokemons.slice(1)[0], energyMap, pokemonCards, blocked);
        }
      }
    });

    return { pokemonCards, blocked };
  }

  private checkAttack(state: State, store: StoreLike, player: Player,
    card: PokemonCard, energyMap: EnergyMap[], pokemonCards: PokemonCard[],
    blocked: { index: number, attack: string }[]
  ) {
    const attacks = card.attacks.filter(attack => {
      const checkAttackCost = new CheckAttackCostEffect(player, attack);
      state = store.reduceEffect(state, checkAttackCost);
      return StateUtils.checkEnoughEnergy(energyMap, checkAttackCost.cost);
    });
    const index = pokemonCards.length;
    pokemonCards.push(card);
    card.attacks.forEach(attack => {
      if (!attacks.includes(attack)) {
        blocked.push({ index, attack: attack.name });
      }
    });
  }

}