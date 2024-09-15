import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'entities/user.entity';
import { Offer } from 'entities/offer.entity';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Offer, { eager: true })
  offer: Offer;
}
