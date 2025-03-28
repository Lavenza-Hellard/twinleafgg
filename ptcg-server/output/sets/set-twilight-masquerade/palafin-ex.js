"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Palafinex = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Palafinex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Finizen';
        this.cardType = W;
        this.hp = 340;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.tags = [game_1.CardTag.POKEMON_EX];
        this.powers = [{
                name: 'Hero\'s Spirit',
                powerType: game_1.PowerType.ABILITY,
                text: 'Put this Pokémon into play only with the effect of Palafin\'s Zero to Hero Ability.'
            }];
        this.attacks = [{
                name: 'Giga Impact',
                cost: [W],
                damage: 250,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.set = 'TWM';
        this.setNumber = '61';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.fullName = 'Palafin ex TWM';
        this.name = 'Palafin ex';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_effects_1.EvolveEffect && effect.pokemonCard === this) {
            if (!prefabs_1.IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_EVOLVE);
            }
        }
        if (effect instanceof game_effects_1.UseAttackEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            const player = effect.player;
            player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
        }
        return state;
    }
}
exports.Palafinex = Palafinex;
