import { Types } from 'mongoose'

/**
 * Valida si un string es un ObjectId válido de MongoDB.
 */
export function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id)
}
