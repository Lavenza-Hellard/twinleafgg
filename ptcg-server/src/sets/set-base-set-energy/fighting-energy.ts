import { CardType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';

export class FightingEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.FIGHTING ];

  public set: string = 'BS';

  public regulationMark = 'ENERGY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '97';

  public name = 'Fighting Energy';

  public fullName = 'Fighting Energy BS';

}
