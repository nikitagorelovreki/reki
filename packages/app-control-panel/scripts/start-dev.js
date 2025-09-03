#!/usr/bin/env node

import { execSync, spawn } from 'child_process';
import os from 'os';

const PORT = 3000;

/**
 * Освобождает порт 3000, завершая процессы, которые его используют
 */
function freePort() {
  try {
    console.log(`Проверка и освобождение порта ${PORT}...`);
    
    // Разные команды для разных ОС
    if (os.platform() === 'win32') {
      // Windows
      const result = execSync(`netstat -ano | findstr :${PORT}`).toString();
      const lines = result.split('\n').filter(Boolean);
      
      if (lines.length > 0) {
        lines.forEach(line => {
          const match = line.match(/\s+(\d+)$/);
          if (match && match[1]) {
            const pid = match[1];
            console.log(`Завершение процесса с PID ${pid}, использующего порт ${PORT}`);
            try {
              execSync(`taskkill /F /PID ${pid}`);
            } catch (e) {
              console.log(`Не удалось завершить процесс с PID ${pid}: ${e.message}`);
            }
          }
        });
      }
    } else {
      // macOS/Linux
      try {
        const result = execSync(`lsof -i :${PORT} -t`).toString();
        const pids = result.split('\n').filter(Boolean);
        
        if (pids.length > 0) {
          pids.forEach(pid => {
            console.log(`Завершение процесса с PID ${pid}, использующего порт ${PORT}`);
            try {
              execSync(`kill -9 ${pid}`);
            } catch (e) {
              console.log(`Не удалось завершить процесс с PID ${pid}: ${e.message}`);
            }
          });
        }
      } catch (e) {
        // Если lsof не нашел процессов, использующих порт, это нормально
        if (!e.message.includes('No such process')) {
          console.log(`Ошибка при проверке порта: ${e.message}`);
        }
      }
    }
    
    console.log(`Порт ${PORT} освобожден или уже был свободен.`);
  } catch (e) {
    console.log(`Ошибка при освобождении порта ${PORT}: ${e.message}`);
  }
}

// Освобождаем порт
freePort();

// Запускаем Vite
console.log('Запуск Vite...');
spawn('vite', [], { 
  stdio: 'inherit',
  shell: true
});
