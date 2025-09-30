export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow returning objects from Zustand store selectors to prevent re-render issues',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      noObjectSelectors:
        'Never return objects from Zustand selectors. Always select individual values to prevent unnecessary re-renders: useStore(state => state.value)',
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    const sourceCode = context.getSourceCode();

    function createFix(node, objectExpression) {
      return function* (fixer) {
        // Only handle simple cases with single property for safety
        if (objectExpression.properties.length === 1) {
          const property = objectExpression.properties[0];

          // Check if this is a member expression that starts with 'state'
          function isStatePropertyAccess(memberExpr) {
            if (memberExpr.type !== 'MemberExpression') return false;

            // Direct state access: state.property
            if (
              memberExpr.object.type === 'Identifier' &&
              memberExpr.object.name === 'state'
            ) {
              return true;
            }

            // Nested state access: state.auth.user, state.config.theme, etc.
            if (memberExpr.object.type === 'MemberExpression') {
              return isStatePropertyAccess(memberExpr.object);
            }

            return false;
          }

          // Only handle simple property access (not computed properties or methods)
          if (
            property.type === 'Property' &&
            !property.computed &&
            !property.method && // Exclude method definitions
            property.key && // Ensure key exists
            property.key.type === 'Identifier' && // Ensure key is identifier
            property.value && // Ensure value exists
            isStatePropertyAccess(property.value)
          ) {
            const propertyName = property.key.name;
            const statePath = sourceCode.getText(property.value);

            // Check if this is part of a destructuring assignment
            const parent = node.parent;
            if (
              parent &&
              parent.type === 'VariableDeclarator' &&
              parent.id &&
              parent.id.type === 'ObjectPattern' &&
              parent.id.properties &&
              parent.id.properties.length === 1 &&
              parent.id.properties[0] &&
              parent.id.properties[0].type === 'Property'
            ) {
              const destructuredProperty = parent.id.properties[0];

              // Comprehensive safety checks for complex destructuring patterns
              if (
                // Ensure all required properties exist
                destructuredProperty.key &&
                destructuredProperty.key.type === 'Identifier' &&
                destructuredProperty.key.name === propertyName &&
                destructuredProperty.value &&
                destructuredProperty.value.type === 'Identifier' &&
                destructuredProperty.value.name &&
                // Avoid complex patterns
                !destructuredProperty.computed && // No computed properties
                !destructuredProperty.method && // No method definitions
                destructuredProperty.kind === 'init' && // Only init properties, not get/set
                // Ensure no default values (which would make .value a different node type)
                !destructuredProperty.value.typeAnnotation // Avoid TypeScript type annotations that could complicate structure
              ) {
                try {
                  // Replace only the function call, not the entire variable declaration
                  const variableName = destructuredProperty.value.name;
                  const newCall = `${sourceCode.getText(node.callee)}(state => ${statePath})`;

                  yield fixer.replaceTextRange(node.range, newCall);
                } catch (error) {
                  // If anything goes wrong during the fix attempt, skip it
                  // This ensures we don't break the code with a bad autofix
                  return;
                }
              }
            } else {
              // Fallback: just replace the selector (safer for complex cases)
              try {
                const newSelector = `state => ${statePath}`;
                yield fixer.replaceTextRange(
                  node.arguments[0].range,
                  newSelector
                );
              } catch (error) {
                // If replacement fails, skip the autofix
                return;
              }
            }
          }
        }
      };
    }

    return {
      CallExpression(node) {
        // Check if this is a call that ends with "Store" (e.g., useStore, useTodoStore, etc.)
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name.match(/use\w*Store$/)
        ) {
          // Check if the argument is a function that returns an object literal
          if (
            node.arguments.length === 1 &&
            node.arguments[0].type === 'ArrowFunctionExpression'
          ) {
            const returnValue = node.arguments[0].body;

            // Check for implicit return with object expression
            if (returnValue.type === 'ObjectExpression') {
              context.report({
                node,
                messageId: 'noObjectSelectors',
                fix: createFix(node, returnValue),
              });
            }

            // Check for explicit return with object expression
            if (
              returnValue.type === 'BlockStatement' &&
              returnValue.body.length > 0 &&
              returnValue.body[returnValue.body.length - 1].type ===
                'ReturnStatement' &&
              returnValue.body[returnValue.body.length - 1].argument &&
              returnValue.body[returnValue.body.length - 1].argument.type ===
                'ObjectExpression'
            ) {
              const objectExpression =
                returnValue.body[returnValue.body.length - 1].argument;
              context.report({
                node,
                messageId: 'noObjectSelectors',
                fix: createFix(node, objectExpression),
              });
            }
          }
        }
      },
    };
  },
};
