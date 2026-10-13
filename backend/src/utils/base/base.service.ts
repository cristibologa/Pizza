import { AnyKeys, Model, QueryFilter, Types, UpdateQuery } from 'mongoose';

type Id = string | Types.ObjectId;

export abstract class BaseService<TEntitySchema extends object> {
  constructor(private model: Model<TEntitySchema>) {}

  async create(data: AnyKeys<TEntitySchema>) {
    // eslint-disable-next-line new-cap
    const doc = new this.model(data);
    return (await doc.save()).toObject();
  }

  async findById(id: Id) {
    return this.model.findById(id).lean().exec();
  }

  async findOne(filter: QueryFilter<TEntitySchema>) {
    return this.model.findOne(filter).lean().exec();
  }

  async findMany(filter: QueryFilter<TEntitySchema> = {}) {
    return this.model.find(filter).lean().exec();
  }

  async updateById(id: Id, $set: UpdateQuery<TEntitySchema>['$set']) {
    return this.model
      .findByIdAndUpdate(
        id,
        {
          $set
        },
        { returnDocument: 'after' }
      )
      .lean()
      .exec();
  }

  async updateOne(filter: QueryFilter<TEntitySchema>, $set: UpdateQuery<TEntitySchema>['$set']) {
    return this.model
      .findOneAndUpdate(
        filter,
        {
          $set
        },
        { returnDocument: 'after' }
      )
      .lean()
      .exec();
  }

  async deleteMany(filter: QueryFilter<TEntitySchema> = {}) {
    return this.model.deleteMany(filter).lean().exec();
  }

  async deleteById(id: Id) {
    return this.model.findByIdAndDelete(id, { returnDocument: 'after' }).lean().exec();
  }

  async deleteOne(filter: QueryFilter<TEntitySchema>) {
    return this.model.findOneAndDelete(filter, { returnDocument: 'after' }).lean().exec();
  }

  async exists(filter: QueryFilter<TEntitySchema>) {
    return !!(await this.model.exists(filter).exec());
  }

  async count(filter: QueryFilter<TEntitySchema> = {}) {
    return this.model.countDocuments(filter).exec();
  }
}
