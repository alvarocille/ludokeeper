import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { useAppTheme } from 'src/styles/useAppTheme';
import { Match } from 'src/api/match';
import { format } from 'date-fns';

export interface MatchCardProps {
  match: Match;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  variant?: 'default' | 'compact';
}

export default function MatchCard({
  match,
  onPress,
  onEdit,
  onDelete,
  variant = 'default',
}: MatchCardProps) {
  const { colors } = useAppTheme();

  const formattedDate = format(new Date(match.date), 'dd/MM/yyyy HH:mm');
  const playerCount = match.players?.length || 0;

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        marginHorizontal: 8,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.primary }}>
            {formattedDate}
          </Text>
          <Text style={{ fontSize: 14, color: colors.text, marginTop: 4 }}>
            Jugadores: {playerCount} — {match.durationMinutes} min
          </Text>
        </View>

        {(onEdit || onDelete) && (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {onEdit && (
              <Pressable onPress={onEdit}>
                <Pencil size={20} color={colors.primary} />
              </Pressable>
            )}
            {onDelete && (
              <Pressable onPress={onDelete}>
                <Trash2 size={20} color={colors.error ?? '#cc0000'} />
              </Pressable>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}
