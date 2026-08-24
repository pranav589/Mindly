import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<GorhomBottomSheet>(null);
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const frame = requestAnimationFrame(() => {
        sheetRef.current?.expand();
      });
      return () => cancelAnimationFrame(frame);
    } else {
      sheetRef.current?.close();
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  if (!shouldRender) {
    return null;
  }

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          <GorhomBottomSheet
            ref={sheetRef}
            index={isOpen ? 0 : -1}
            enableDynamicSizing={true}
            enablePanDownToClose={true}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.background}
            handleIndicatorStyle={styles.handleIndicator}
            style={{
              marginTop: "5%",
            }}
          >
            <BottomSheetScrollView
              style={{
                paddingBottom: insets.bottom + 20,
              }}
            >
              <View
                style={[
                  styles.inner,
                  {
                    paddingBottom: insets.bottom + 40,
                  },
                ]}
              >
                {title && (
                  <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{title}</Text>
                  </View>
                )}
                <View style={styles.childrenWrapper}>{children}</View>
              </View>
            </BottomSheetScrollView>
          </GorhomBottomSheet>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: "#e1e3e3",
    width: 40,
    height: 5,
  },
  inner: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  titleContainer: {
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#191c1d",
    paddingLeft: 4,
  },
  childrenWrapper: {
    width: "100%",
  },
});
