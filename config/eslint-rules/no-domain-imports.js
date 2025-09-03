export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Запрещает импорт доменных моделей в API и App слоях',
      category: 'Architecture',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      forbiddenDomainImport: 'Запрещен импорт доменных моделей в {{layer}}. Используйте Service Models или DTO.',
    },
  },
  create(context) {
    const filename = context.getFilename();
    
    // Определяем слой по пути файла
    const isApiLayer = filename.includes('/api/') || filename.includes('/app-control-panel/') || filename.includes('/app-auth-server/') || filename.includes('/app-core-server/') || filename.includes('/app-telegram-bot/');
    const _isServiceLayer = filename.includes('/core-service/') || filename.includes('/auth-service/');
    
    return {
      ImportDeclaration(node) {
        if (!isApiLayer) return;
        
        const importSource = node.source.value;
        
        // Проверяем импорты доменных моделей
        const domainImports = [
          '@reki/core-domain',
          '@reki/auth-domain',
        ];
        
        if (domainImports.some(domain => importSource.startsWith(domain))) {
          context.report({
            node,
            messageId: 'forbiddenDomainImport',
            data: {
              layer: 'API/App слое',
            },
          });
        }
      },
    };
  },
};
