import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

interface RestTimerProps {
  restSeconds: number;
  onComplete: () => void;
  onSkip: () => void;
  isActive: boolean;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  restSeconds,
  onComplete,
  onSkip,
  isActive,
}) => {
  const [timeLeft, setTimeLeft] = useState(restSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(restSeconds);
      return;
    }

    // Iniciar animación de progreso
    Animated.timing(progress, {
      toValue: 1,
      duration: restSeconds * 1000,
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      if (!isPaused) {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer completado
            clearInterval(interval);
            Vibration.vibrate([0, 500, 200, 500]); // Patrón de vibración
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, restSeconds, onComplete, progress]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const addTime = (seconds: number) => {
    setTimeLeft(prev => Math.max(0, prev + seconds));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressColor = (): string => {
    const percentage = (timeLeft / restSeconds) * 100;
    if (percentage > 60) return COLORS.SUCCESS;
    if (percentage > 30) return COLORS.WARNING;
    return COLORS.ERROR;
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  if (!isActive) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="timer-outline" size={24} color={COLORS.PRIMARY_GREEN} />
        <Text style={styles.title}>Tiempo de Descanso</Text>
        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Saltar</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { 
                width: progressWidth,
                backgroundColor: getProgressColor(),
              }
            ]} 
          />
        </View>
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, { color: getProgressColor() }]}>
          {formatTime(timeLeft)}
        </Text>
        <Text style={styles.totalTimeText}>
          de {formatTime(restSeconds)}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          onPress={() => addTime(-15)} 
          style={[styles.controlButton, styles.subtractButton]}
          disabled={timeLeft <= 15}
        >
          <Ionicons name="remove" size={20} color={COLORS.WHITE} />
          <Text style={styles.controlButtonText}>15s</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={togglePause} 
          style={[styles.controlButton, styles.pauseButton]}
        >
          <Ionicons 
            name={isPaused ? "play" : "pause"} 
            size={24} 
            color={COLORS.WHITE} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => addTime(15)} 
          style={[styles.controlButton, styles.addButton]}
        >
          <Ionicons name="add" size={20} color={COLORS.WHITE} />
          <Text style={styles.controlButtonText}>15s</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          onPress={() => setTimeLeft(30)} 
          style={styles.quickButton}
        >
          <Text style={styles.quickButtonText}>30s</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setTimeLeft(60)} 
          style={styles.quickButton}
        >
          <Text style={styles.quickButtonText}>1m</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setTimeLeft(90)} 
          style={styles.quickButton}
        >
          <Text style={styles.quickButtonText}>1:30</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setTimeLeft(120)} 
          style={styles.quickButton}
        >
          <Text style={styles.quickButtonText}>2m</Text>
        </TouchableOpacity>
      </View>

      {isPaused && (
        <View style={styles.pausedOverlay}>
          <Ionicons name="pause-circle" size={48} color={COLORS.WARNING} />
          <Text style={styles.pausedText}>Pausado</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    textAlign: 'center',
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 8,
  },
  skipText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBackground: {
    height: 8,
    backgroundColor: COLORS.GRAY_LIGHTER,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  totalTimeText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subtractButton: {
    backgroundColor: COLORS.ERROR,
  },
  pauseButton: {
    backgroundColor: COLORS.PRIMARY_GREEN,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  addButton: {
    backgroundColor: COLORS.SUCCESS,
  },
  controlButtonText: {
    fontSize: 10,
    color: COLORS.WHITE,
    fontWeight: '600',
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_LIGHTER,
  },
  quickButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.GRAY_LIGHTEST,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
  },
  quickButtonText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  pausedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.WHITE + 'E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  pausedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.WARNING,
    marginTop: 8,
  },
});

export default RestTimer;
