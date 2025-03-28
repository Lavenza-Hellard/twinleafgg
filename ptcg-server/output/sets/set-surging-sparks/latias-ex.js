"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Latiasex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Latiasex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Skyline',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your Basic Pokémon have no Retreat Cost.'
            }];
        this.attacks = [
            {
                name: 'Infinity Blade',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 200,
                text: 'This Pokémon can\'t attack during your next turn.'
            },
        ];
        this.set = 'SSP';
        this.regulationMark = 'H';
        this.setNumber = '76';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Latias ex';
        this.fullName = 'Latias ex SSP';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('second marker added');
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            const active = effect.player.active.getPokemonCard();
            if (owner !== player || active === undefined) {
                return state;
            }
            let isLatiasexInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isLatiasexInPlay = true;
                }
            });
            if (!isLatiasexInPlay) {
                return state;
            }
            if (!prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this) && active.stage === card_types_1.Stage.BASIC) {
                effect.cost = [];
            }
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                console.log('attack blocked');
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
            console.log('marker added');
        }
        return state;
    }
}
exports.Latiasex = Latiasex;
