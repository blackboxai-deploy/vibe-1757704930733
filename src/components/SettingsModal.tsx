'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TimerSettings, TIMER_PRESETS } from '@/lib/timerUtils';

interface SettingsModalProps {
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
  children: React.ReactNode;
}

export function SettingsModal({ settings, onSettingsChange, children }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<TimerSettings>(settings);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onSettingsChange(localSettings);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    setIsOpen(false);
  };

  const handlePresetSelect = (presetKey: keyof typeof TIMER_PRESETS) => {
    const preset = TIMER_PRESETS[presetKey];
    setLocalSettings({
      ...localSettings,
      workDuration: preset.workDuration,
      shortBreakDuration: preset.shortBreakDuration,
      longBreakDuration: preset.longBreakDuration,
      sessionsBeforeLongBreak: preset.sessionsBeforeLongBreak,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Timer Settings</DialogTitle>
          <DialogDescription>
            Customize your Pomodoro timer to fit your productivity style.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="timer" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="space-y-6 mt-6">
            <div className="space-y-6">
              {/* Work Duration */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Work Duration: {localSettings.workDuration} minutes
                </Label>
                <Slider
                  value={[localSettings.workDuration]}
                  onValueChange={([value]) =>
                    setLocalSettings({ ...localSettings, workDuration: value })
                  }
                  min={15}
                  max={60}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>15 min</span>
                  <span>60 min</span>
                </div>
              </div>

              {/* Short Break Duration */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Short Break: {localSettings.shortBreakDuration} minutes
                </Label>
                <Slider
                  value={[localSettings.shortBreakDuration]}
                  onValueChange={([value]) =>
                    setLocalSettings({ ...localSettings, shortBreakDuration: value })
                  }
                  min={3}
                  max={15}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>3 min</span>
                  <span>15 min</span>
                </div>
              </div>

              {/* Long Break Duration */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Long Break: {localSettings.longBreakDuration} minutes
                </Label>
                <Slider
                  value={[localSettings.longBreakDuration]}
                  onValueChange={([value]) =>
                    setLocalSettings({ ...localSettings, longBreakDuration: value })
                  }
                  min={10}
                  max={30}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>10 min</span>
                  <span>30 min</span>
                </div>
              </div>

              {/* Sessions Before Long Break */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Sessions Before Long Break: {localSettings.sessionsBeforeLongBreak}
                </Label>
                <Slider
                  value={[localSettings.sessionsBeforeLongBreak]}
                  onValueChange={([value]) =>
                    setLocalSettings({ ...localSettings, sessionsBeforeLongBreak: value })
                  }
                  min={2}
                  max={8}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>2 sessions</span>
                  <span>8 sessions</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {(Object.entries(TIMER_PRESETS) as [keyof typeof TIMER_PRESETS, typeof TIMER_PRESETS[keyof typeof TIMER_PRESETS]][]).map(([key, preset]) => (
                <Card
                  key={key}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handlePresetSelect(key)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{preset.name}</CardTitle>
                    <CardDescription>
                      {preset.workDuration}min work • {preset.shortBreakDuration}min short break • {preset.longBreakDuration}min long break
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-sm text-gray-600">
                      Long break after {preset.sessionsBeforeLongBreak} sessions
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6 mt-6">
            <div className="space-y-6">
               {/* Sound Settings */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Sound Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Play sound when timer completes
                  </p>
                </div>
                <Switch
                  checked={localSettings.soundEnabled}
                  onCheckedChange={(checked) =>
                    setLocalSettings({ ...localSettings, soundEnabled: checked })
                  }
                />
              </div>

              {/* Auto-start Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Auto-start Breaks</Label>
                    <p className="text-sm text-gray-600">
                      Automatically start break timers
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.autoStartBreaks}
                    onCheckedChange={(checked) =>
                      setLocalSettings({ ...localSettings, autoStartBreaks: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Auto-start Work</Label>
                    <p className="text-sm text-gray-600">
                      Automatically start work sessions after breaks
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.autoStartWork}
                    onCheckedChange={(checked) =>
                      setLocalSettings({ ...localSettings, autoStartWork: checked })
                    }
                  />
                </div>

 
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}