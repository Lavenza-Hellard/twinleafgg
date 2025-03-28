import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
export declare class NsCastle extends TrainerCard {
    trainerType: TrainerType;
    tags: CardTag[];
    set: string;
    name: string;
    fullName: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    text: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
