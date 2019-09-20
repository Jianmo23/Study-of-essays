提供 `mode` 配置选项，告知 webpack 使用相应模式的内置优化
**默认值是 `production`**

mode: string
- `development`

- `production`

- `none`

## `development`
webpack 会将 `process.env.NODE_ENV` 的值设置为 `development`。

启用 `NamedChunksPlugin`, `NamedModulesPlugin`。

## `production`
webpack 会将 `process.env.NODE_ENV` 的值设置为 `production`。

启用 `FlagDependencyUsagePlugin`, `FlagIncludedChunksPlugin`, `ModuleConcatenationPlugin`,
`NoEmitOnErrorsPlugin`, `OccurrenceOrderPlugin`, `SideEffectsFlagPlugin`, `UglifyJsPlugin`

## `none`
webpack 不做任何操作
