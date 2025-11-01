import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type AdminConsoleProps = {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (command: string) => void;
};

export default function AdminConsole({ isOpen, onClose, onCommand }: AdminConsoleProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setHistory(prev => [...prev, `> ${input}`]);
    onCommand(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-black/90 border-green-500/50 text-green-400 font-mono">
        <div className="p-4 border-b border-green-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Terminal" size={20} className="text-green-400" />
            <span className="font-bold">ADMIN CONSOLE v1.0</span>
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={onClose}
            className="text-green-400 hover:bg-green-500/20"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="h-64 overflow-y-auto bg-black/50 rounded p-3 space-y-1 border border-green-500/20">
            {history.length === 0 ? (
              <div className="text-green-400/60">
                <p>Welcome to Admin Console</p>
                <p className="mt-2">Available commands:</p>
                <p className="ml-2">/adminChat true/false - вкл/выкл админ сообщения</p>
                <p className="ml-2">/admin anonim - писать от анонима</p>
                <p className="ml-2">/admin default - писать как обычный пользователь</p>
                <p className="ml-2">/adminLesson true/false - режим редактирования расписания</p>
              </div>
            ) : (
              history.map((line, i) => (
                <p key={i} className="text-green-400">{line}</p>
              ))
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400">$</span>
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Введите команду..."
                className="pl-8 bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/30 font-mono"
              />
            </div>
            <Button type="submit" className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50">
              Execute
            </Button>
          </form>

          <div className="text-xs text-green-400/40">
            Press ESC to close | Enter to execute
          </div>
        </div>
      </Card>
    </div>
  );
}