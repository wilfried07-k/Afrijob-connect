import { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

type Option = { label: string; value: string };

type Props = {
  icon?: keyof typeof MaterialIcons.glyphMap;
  placeholder: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

export default function SelectField({ icon, placeholder, options, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="h-14 flex-row items-center rounded-md border border-outline-variant bg-surface-container-lowest px-md"
      >
        {icon && <MaterialIcons name={icon} size={20} color={colors.outline} />}
        <Text className={`ml-2 flex-1 font-sans text-body-lg ${selected ? 'text-on-surface' : 'text-outline'}`}>
          {selected ? selected.label : placeholder}
        </Text>
        <MaterialIcons name="expand-more" size={20} color={colors.outline} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setOpen(false)}>
          <Pressable className="max-h-[60%] rounded-t-lg bg-surface-container-lowest p-lg" onPress={() => {}}>
            <Text className="mb-md font-sans-semibold text-title-lg text-on-surface">{placeholder}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  className="flex-row items-center justify-between py-md"
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <Text className="font-sans text-body-lg text-on-surface">{item.label}</Text>
                  {item.value === value && (
                    <MaterialIcons name="check" size={20} color={colors.primary} />
                  )}
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View className="h-[1px] bg-outline-variant/40" />}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
