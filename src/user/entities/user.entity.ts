import { BaseEntity } from '../../common/base.common';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ProviderEnum } from './provider.enum';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  public email: string;

  @Column()
  public nickname: string;

  @Column({ nullable: true })
  public password?: string;

  @Column({
    type: 'enum',
    enum: ProviderEnum,
    default: ProviderEnum.Local,
  })
  public provider: ProviderEnum;

  @BeforeInsert()
  async hashPassword() {
    if (this.provider === ProviderEnum.Local) {
      const saltValue = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, saltValue);
    }
  }

  async checkPassword(aPassword: string) {
    const isMatched = await bcrypt.compare(aPassword, this.password);
    return isMatched;
  }
}
