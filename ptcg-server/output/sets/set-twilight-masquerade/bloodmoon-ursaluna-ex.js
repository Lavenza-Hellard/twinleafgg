"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodmoonUrsalunaex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class BloodmoonUrsalunaex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 260;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Seasoned Skill',
                powerType: game_1.PowerType.ABILITY,
                text: 'Blood Moon used by this Pokémon costs [C] less for each Prize card your opponent has taken.'
            }];
        this.attacks = [
            {
                name: 'Blood Moon',
                cost: [C, C, C, C, C],
                damage: 240,
                text: 'This Pokémon can\'t attack during your next turn.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'TWM';
        this.setNumber = '141';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Bloodmoon Ursaluna ex';
        this.fullName = 'Bloodmoon Ursaluna ex TWM';
        // public getColorlessReduction(state: State): number {
        //   const player = state.players[state.activePlayer];
        //   const opponent = StateUtils.getOpponent(state, player);
        //   const remainingPrizes = opponent.getPrizeLeft();
        //   return 6 - remainingPrizes;
        // }
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
            if (index === -1) {
                return state;
            }
            const remainingPrizes = opponent.getPrizeLeft();
            const prizeToColorlessReduction = {
                5: 1,
                4: 2,
                3: 3,
                2: 4,
                1: 5
            };
            const colorlessToRemove = prizeToColorlessReduction[remainingPrizes] || 0;
            for (let i = 0; i < colorlessToRemove; i++) {
                const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                if (index !== -1) {
                    effect.cost.splice(index, 1);
                }
            }
            return state;
        }
        if (effect instanceof game_effects_1.UseAttackEffect && effect.source.cards.includes(this)) {
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
        }
        return state;
    }
}
exports.BloodmoonUrsalunaex = BloodmoonUrsalunaex;
