// Globally register all base components for convenience, because they
// will be used very frequently. Components are registered using the
// PascalCased version of their file name.

import Vue from 'vue'

// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
    // Look for files in the current directory
    './global',
    // Do not look in subdirectories
    false,
    // Only include "_base-" prefixed .vue files
    /.vue$/
)

// For each matching file name...
requireComponent.keys().forEach((fileName) => {
    const componentConfig = requireComponent(fileName);
    const componentName = fileName.split('.')[1].slice(1);
    // Globally register the component
    Vue.component(componentName, componentConfig.default || componentConfig);
})