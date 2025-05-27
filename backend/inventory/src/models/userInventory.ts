import { Document, model, Schema, Types } from 'mongoose'

export type InventorySource = 'catalog' | 'custom'

export interface IUserInventory extends Document {
  userId: string
  source: InventorySource
  gameId?: Types.ObjectId
  customData?: {
    name: string
    description?: string
    players?: {
      min: number
      max: number
    }
    duration?: number
    imageUrl?: string
  }
  acquisitionDate?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const userInventorySchema = new Schema<IUserInventory>(
  {
    userId: { type: String, required: true, index: true },

    source: {
      type: String,
      enum: ['catalog', 'custom'],
      required: true
    },

    gameId: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required(this: IUserInventory) {
        return this.source === 'catalog'
      }
    },
    customData: {
      type: new Schema({
        name: {
          type: String,
          required(this: IUserInventory) {
            return this.source === 'custom'
          }
        },
        description: { type: String },
        minPlayers: { type: Number },
        maxPlayers: { type: Number },
        playTime: { type: Number },
        imageUrl: { type: String }
      }, { _id: false })
    },
    acquisitionDate: Date,
    notes: String
  },
  { timestamps: true }
)

export const UserInventory = model<IUserInventory>('UserInventory', userInventorySchema)
