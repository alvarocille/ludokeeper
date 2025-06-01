import { model, Schema, Types } from 'mongoose'

export type InventorySource = 'catalog' | 'custom'

export interface IUserInventory {
  userId: string
  source: InventorySource
  gameId?: Types.ObjectId
  customData?: {
    name: string
    description?: string
    minPlayers?: number
    maxPlayers?: number
    playTime?: number
    imageUrl?: string
  }
  acquisitionDate?: Date
  notes?: string
  createdAt?: Date
  updatedAt?: Date
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
      ref: 'CatalogGame',
      required: function (this: IUserInventory) {
        return this.source === 'catalog'
      }
    },

    customData: {
      type: new Schema(
        {
          name: {
            type: String,
            required: function (this: IUserInventory) {
              return this.source === 'custom'
            }
          },
          description: { type: String },
          minPlayers: { type: Number },
          maxPlayers: { type: Number },
          playTime: { type: Number },
          imageUrl: { type: String }
        },
        { _id: false }
      )
    },

    acquisitionDate: Date,
    notes: String
  },
  { timestamps: true }
)

export const UserInventory = model<IUserInventory>('UserInventory', userInventorySchema)
