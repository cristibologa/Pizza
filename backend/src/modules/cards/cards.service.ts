import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Buffer } from 'node:buffer';

import { BaseService } from '@/utils/base';
import { Result } from '@/utils/helpers';

import { CardEntitySchema } from './card.schema';
import { GetCardsResponse } from './responses';

export interface SaveCardParams {
  cvv: string;
  expireDate: string;
  pan: string;
  phone: string;
}

export interface BuildCryptoPacketParams {
  cvv: string;
  expireDate: string;
  pan: string;
}

@Injectable()
export class CardsService extends BaseService<CardEntitySchema> {
  constructor(
    @InjectModel(CardEntitySchema.name) private readonly cardModel: Model<CardEntitySchema>
  ) {
    super(cardModel);
  }

  buildCryptoPacket(buildCryptoPacketParams: BuildCryptoPacketParams) {
    return Buffer.from(JSON.stringify(buildCryptoPacketParams)).toString('base64');
  }

  private maskPan(pan: string) {
    return pan.replace(/\D/g, '').slice(-4);
  }

  async getCards(phone: string): Promise<GetCardsResponse> {
    const cards = await this.findMany({ phone });
    return Result.success({ cards });
  }

  async getCardById(phone: string, cardId: string) {
    if (!Types.ObjectId.isValid(cardId)) {
      throw new BadRequestException(Result.fail('Некорректный ID карты'));
    }

    const card = await this.findOne({ _id: cardId, phone });

    if (!card) {
      throw new BadRequestException(Result.fail('Карта не найдена'));
    }

    return card;
  }

  async saveCard(saveCardParams: SaveCardParams) {
    const { pan, phone, cvv, expireDate } = saveCardParams;
    const panMasked = this.maskPan(pan);
    const cryptoPacket = this.buildCryptoPacket({
      pan,
      expireDate,
      cvv
    });

    const updatedCard = await this.cardModel.findOneAndUpdate(
      { phone, panMasked },
      {
        $set: {
          phone,
          panMasked,
          expiry: expireDate,
          cryptoPacket
        }
      },
      { new: true, upsert: true }
    );

    return updatedCard;
  }

  async refreshCardData(phone: string, cardId: string, cvv: string) {
    const card = await this.getCardById(phone, cardId);

    const cryptoPacket = this.buildCryptoPacket({
      pan: card.panMasked,
      expireDate: card.expiry,
      cvv
    });

    const updatedCard = await this.updateById(cardId, { $set: { cryptoPacket } });

    if (!updatedCard) {
      throw new BadRequestException(Result.fail('Не смогли обновить карту'));
    }

    return updatedCard;
  }

  async deleteCard(phone: string, cardId: string) {
    if (!Types.ObjectId.isValid(cardId)) {
      throw new BadRequestException(Result.fail('Некорректный ID карты'));
    }

    const deletedCard = await this.deleteOne({
      _id: cardId,
      phone
    });

    if (!deletedCard) {
      throw new BadRequestException(Result.fail('Карта не найдена'));
    }

    return Result.success({ id: String(deletedCard._id) });
  }
}
