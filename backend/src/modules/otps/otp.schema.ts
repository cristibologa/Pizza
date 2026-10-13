import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'otps',
  timestamps: { createdAt: true, updatedAt: false }
})
export class OtpEntitySchema {
  createdAt: Date;

  @Prop({
    required: true,
    index: {
      expires: 0
    }
  })
  expiresAt: Date;

  @Prop({
    required: true
  })
  retryDelay: number;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  code: number;
}

export type OtpDocument = HydratedDocument<OtpEntitySchema>;
export const OtpSchema = SchemaFactory.createForClass(OtpEntitySchema);
