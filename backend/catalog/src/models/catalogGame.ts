import { Schema, model, Document } from 'mongoose'

export interface ICatalogGame extends Document {
  name: string
  description?: string
  minPlayers?: number
  maxPlayers?: number
  playTime?: number
  yearPublished?: number
  categories?: string[]
  mechanics?: string[]
  publisher?: string
  imageUrl?: string
  source?: 'manual' | 'external'
}

const catalogGameSchema = new Schema<ICatalogGame>({
  name: { type: String, required: true },
  description: { type: String },
  minPlayers: { type: Number },
  maxPlayers: { type: Number },
  playTime: { type: Number },
  yearPublished: { type: Number },
  categories: [{ type: String }],
  mechanics: [{ type: String }],
  publisher: { type: String },
  imageUrl: { type: String },
  source: {
    type: String,
    enum: ['manual', 'external'],
    default: 'manual'
  }
}, {
  timestamps: true
})

export const CatalogGame = model<ICatalogGame>('CatalogGame', catalogGameSchema)
