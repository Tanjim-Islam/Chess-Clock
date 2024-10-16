"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  PlusIcon,
  MinusIcon,
  FlagIcon,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

const MIN_TIME = 30; // 30 seconds
const TIME_STEP = 30; // 30 seconds

export default function EnhancedChessClock() {
  const [player1Time, setPlayer1Time] = useState(600); // 10 minutes in seconds
  const [player2Time, setPlayer2Time] = useState(600);
  const [activePlayer, setActivePlayer] = useState<1 | 2 | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [increment, setIncrement] = useState(5); // 5 seconds increment
  const [isIncrementEnabled, setIsIncrementEnabled] = useState(true);
  const [player1Flag, setPlayer1Flag] = useState(false);
  const [player2Flag, setPlayer2Flag] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (activePlayer === 1) {
          setPlayer1Time((prevTime) => {
            if (prevTime <= 1) {
              setIsRunning(false);
              setPlayer1Flag(true);
              return 0;
            }
            return prevTime - 1;
          });
        } else if (activePlayer === 2) {
          setPlayer2Time((prevTime) => {
            if (prevTime <= 1) {
              setIsRunning(false);
              setPlayer2Flag(true);
              return 0;
            }
            return prevTime - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, activePlayer]);

  const startGame = () => {
    if (!isRunning && player1Time > 0 && player2Time > 0) {
      setIsRunning(true);
      setActivePlayer(1);
    }
  };

  const pauseGame = () => {
    setIsRunning(false);
  };

  const resetGame = () => {
    setIsRunning(false);
    setActivePlayer(null);
    setPlayer1Time(600);
    setPlayer2Time(600);
    setPlayer1Flag(false);
    setPlayer2Flag(false);
  };

  const switchPlayer = () => {
    if (isRunning) {
      setActivePlayer((prev) => {
        if (prev === 1) {
          if (isIncrementEnabled) setPlayer1Time((t) => t + increment);
          return 2;
        } else {
          if (isIncrementEnabled) setPlayer2Time((t) => t + increment);
          return 1;
        }
      });
    }
  };

  const handleClockClick = (player: 1 | 2) => {
    if (isRunning && activePlayer === player) {
      switchPlayer();
    }
  };

  const adjustTime = (player: 1 | 2, amount: number) => {
    const setTime = player === 1 ? setPlayer1Time : setPlayer2Time;
    setTime((prevTime) =>
      Math.max(MIN_TIME, Math.min(prevTime + amount, 3600))
    ); // Min 30 seconds, max 1 hour
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Card className="w-full max-w-2xl shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="relative flex items-center sm:block">
              <Button
                size="sm"
                variant="ghost"
                className="absolute left-2 top-2 sm:top-auto sm:bottom-2 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  adjustTime(1, -TIME_STEP);
                }}
                disabled={isRunning}
              >
                <MinusIcon className="w-4 h-4" />
              </Button>
              <Button
                variant={activePlayer === 1 ? "default" : "outline"}
                className={`w-full h-48 text-4xl font-bold transition-all duration-300 ${
                  player1Flag ? "bg-destructive hover:bg-destructive" : ""
                }`}
                onClick={() => handleClockClick(1)}
                disabled={!isRunning || player1Flag}
              >
                {formatTime(player1Time)}
                {player1Flag && (
                  <FlagIcon className="absolute top-2 right-2 w-6 h-6 text-destructive-foreground animate-bounce" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-2 sm:top-auto sm:bottom-2 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  adjustTime(1, TIME_STEP);
                }}
                disabled={isRunning}
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative flex items-center sm:block">
              <Button
                size="sm"
                variant="ghost"
                className="absolute left-2 top-2 sm:top-auto sm:bottom-2 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  adjustTime(2, -TIME_STEP);
                }}
                disabled={isRunning}
              >
                <MinusIcon className="w-4 h-4" />
              </Button>
              <Button
                variant={activePlayer === 2 ? "default" : "outline"}
                className={`w-full h-48 text-4xl font-bold transition-all duration-300 ${
                  player2Flag ? "bg-destructive hover:bg-destructive" : ""
                }`}
                onClick={() => handleClockClick(2)}
                disabled={!isRunning || player2Flag}
              >
                {formatTime(player2Time)}
                {player2Flag && (
                  <FlagIcon className="absolute top-2 right-2 w-6 h-6 text-destructive-foreground animate-bounce" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-2 sm:top-auto sm:bottom-2 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  adjustTime(2, TIME_STEP);
                }}
                disabled={isRunning}
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-center space-x-4 mb-6">
            {!isRunning ? (
              <Button
                onClick={startGame}
                disabled={isRunning || player1Time === 0 || player2Time === 0}
              >
                <PlayIcon className="w-4 h-4 mr-2" />
                Start
              </Button>
            ) : (
              <Button onClick={pauseGame}>
                <PauseIcon className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={resetGame}>
              <RotateCcwIcon className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">
              Time Increment (seconds):
            </span>
            <div className="flex items-center space-x-2">
              <Slider
                value={[increment]}
                onValueChange={(value) => setIncrement(value[0])}
                max={60}
                step={1}
                className="w-32"
              />
              <span className="w-8 text-center">{increment}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Enable Increment:</span>
            <Switch
              checked={isIncrementEnabled}
              onCheckedChange={setIsIncrementEnabled}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
