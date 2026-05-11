import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';

/**
 * Emoji/Unicode based Icon — drop-in replacement for `<Ionicons />`
 *
 * Why? @expo/vector-icons font loading fails in Expo Go over ngrok tunnels
 * ("Font file for ionicons is empty"). Using Text-based emoji avoids any
 * external font load, works everywhere, and renders instantly.
 *
 * Usage: <Icon name="search" size={24} color="#FFF" />
 */

type IconName =
  | 'home' | 'home-outline'
  | 'bar-chart' | 'bar-chart-outline'
  | 'calendar' | 'calendar-outline'
  | 'settings' | 'settings-outline'
  | 'add' | 'add-circle' | 'add-outline'
  | 'arrow-down-circle' | 'arrow-up-circle'
  | 'backspace-outline'
  | 'briefcase' | 'briefcase-outline'
  | 'chevron-back' | 'chevron-down' | 'chevron-forward' | 'chevron-up'
  | 'close' | 'close-outline' | 'close-circle'
  | 'cloud' | 'cloud-outline'
  | 'information-circle-outline' | 'information-circle'
  | 'language-outline' | 'language'
  | 'mail' | 'mail-outline'
  | 'notifications' | 'notifications-outline'
  | 'remove-outline' | 'remove'
  | 'search' | 'search-outline'
  | 'pencil' | 'trash' | 'star' | 'heart'
  | 'lock-closed' | 'lock-open'
  | 'wallet' | 'card' | 'cash'
  | 'shield' | 'shield-checkmark'
  | 'document-text' | 'document-text-outline'
  | 'log-out' | 'log-out-outline'
  | 'help-circle' | 'help-circle-outline'
  | 'checkmark' | 'checkmark-circle'
  | 'menu' | 'ellipsis-horizontal' | 'ellipsis-vertical'
  | 'refresh' | 'refresh-outline'
  | 'eye' | 'eye-off'
  | 'people' | 'person' | 'person-outline'
  | 'time' | 'time-outline'
  | 'flag' | 'flag-outline'
  | 'star-outline' | 'heart-outline'
  | string;

const ICON_MAP: Record<string, string> = {
  // Navigation
  'home': '🏠',
  'home-outline': '🏠',
  'bar-chart': '📊',
  'bar-chart-outline': '📊',
  'calendar': '📅',
  'calendar-outline': '📅',
  'settings': '⚙',
  'settings-outline': '⚙',

  // Actions
  'add': '＋',
  'add-circle': '⊕',
  'add-outline': '＋',
  'remove': '−',
  'remove-outline': '−',
  'close': '✕',
  'close-outline': '✕',
  'close-circle': '⊗',
  'checkmark': '✓',
  'checkmark-circle': '✓',
  'pencil': '✎',
  'trash': '🗑',
  'refresh': '↻',
  'refresh-outline': '↻',

  // Chevrons & Arrows
  'chevron-back': '‹',
  'chevron-forward': '›',
  'chevron-up': '⌃',
  'chevron-down': '⌄',
  'arrow-up-circle': '⬆',
  'arrow-down-circle': '⬇',
  'arrow-back': '←',
  'arrow-forward': '→',

  // Communication
  'mail': '✉',
  'mail-outline': '✉',
  'notifications': '🔔',
  'notifications-outline': '🔔',
  'megaphone': '📢',

  // Symbols
  'search': '🔍',
  'search-outline': '🔍',
  'language': '🌐',
  'language-outline': '🌐',
  'globe': '🌐',
  'star': '★',
  'star-outline': '☆',
  'heart': '♥',
  'heart-outline': '♡',
  'flag': '⚑',
  'flag-outline': '⚐',
  'eye': '👁',
  'eye-off': '👁',
  'time': '⏱',
  'time-outline': '⏱',

  // Money/Finance
  'wallet': '💼',
  'card': '💳',
  'cash': '💵',
  'briefcase': '💼',
  'briefcase-outline': '💼',

  // Security
  'lock-closed': '🔒',
  'lock-open': '🔓',
  'shield': '🛡',
  'shield-checkmark': '🛡',
  'key': '🔑',

  // Info
  'information-circle': 'ⓘ',
  'information-circle-outline': 'ⓘ',
  'help-circle': '?',
  'help-circle-outline': '?',
  'alert': '⚠',
  'warning': '⚠',
  'document-text': '📄',
  'document-text-outline': '📄',

  // Misc
  'backspace-outline': '⌫',
  'backspace': '⌫',
  'menu': '☰',
  'ellipsis-horizontal': '⋯',
  'ellipsis-vertical': '⋮',
  'cloud': '☁',
  'cloud-outline': '☁',
  'log-out': '⇥',
  'log-out-outline': '⇥',
  'people': '👥',
  'person': '👤',
  'person-outline': '👤',
};

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const Icon: React.FC<IconProps> = ({ name, size = 16, color = '#000', style }) => {
  const glyph = ICON_MAP[name] || '◯';
  return (
    <Text
      style={[
        {
          fontSize: size,
          lineHeight: size * 1.15,
          color,
          textAlign: 'center',
          // Force consistent rendering across platforms
          includeFontPadding: false,
        },
        style,
      ]}
      allowFontScaling={false}
    >
      {glyph}
    </Text>
  );
};

// Backwards-compat: re-export with both names
export default Icon;
export { Icon as Ionicons };
