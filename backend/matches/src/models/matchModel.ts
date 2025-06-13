import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  gameId: { type: String, required: false },
  date: { type: Date, required: true },
  durationMinutes: {
    type: Number,
    required: true,
    min: 1,
  },
  players: [
    {
      name: { type: String, required: true },
      score: { type: Number, required: true, default: 0 },
    },
  ],
});


export const Match = mongoose.model('Match', matchSchema);
