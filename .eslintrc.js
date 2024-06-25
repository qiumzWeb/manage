module.exports = {
	'env': {
		'browser': true,
		'es2021': true,
    'node': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:react/recommended',
    'plugin:react/jsx-runtime'
	],
	'parserOptions': {
		'ecmaFeatures': {
			'jsx': true
		},
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
	'plugins': [
		'react'
	],
  'settings': {
    "react": {
      "createClass": "createReactClass", // Regex for Component Factory to use,
      "pragma": "React",  // Pragma to use, default to "React"
      "fragment": "Fragment",  // Fragment to use (may be a property of <pragma>), default to "Fragment"
      "version": "detect", // React version. "detect" automatically picks the version you have installed.
      "flowVersion": "0.53" // Flow version
    },
  },
	'rules': {
		'indent': ['off','tab'],
		'linebreak-style': ['off','windows'],
		'quotes': ['off','single'],
		'semi': ['off','never'],
    'react/prop-types': ['off'],
    'no-unused-vars': ['off'],
    'no-empty': ['off'],
    'react/display-name': ['off'],
    'no-prototype-builtins': 'off',
    'no-extra-semi': 'off',
    'no-undef': 'off',
    'no-useless-escape': 'off'
	}
};
