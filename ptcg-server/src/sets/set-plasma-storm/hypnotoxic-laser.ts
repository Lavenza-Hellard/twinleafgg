import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SpecialCondition, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../../game/store/state-utils';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const active = opponent.active;

  const isPoisoned = active.specialConditions.includes(SpecialCondition.POISONED);
  const isAsleep = active.specialConditions.includes(SpecialCondition.ASLEEP);

  if (isPoisoned && isAsleep) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  active.addSpecialCondition(SpecialCondition.POISONED);

  let coinResult: boolean = false;
  yield store.prompt(state, [
    new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
  ], result => {
    coinResult = result;
    next();
  });

  if (coinResult === false) {
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
  }
  player.supporter.moveCardTo(effect.trainerCard, player.discard);
  active.addSpecialCondition(SpecialCondition.ASLEEP);
  return state;
}

export class HypnotoxicLaser extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public tags: string[] = [CardTag.TEAM_PLASMA];

  public set: string = 'PLS';

  public name: string = 'Hypnotoxic Laser';

  public fullName: string = 'Hypnotoxic Laser PLS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '123';

  public text: string =
    'Your opponent\'s Active Pokemon is now Poisoned. Flip a coin. ' +
    'If heads, your opponent\'s Active Pokemon is also Asleep.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
