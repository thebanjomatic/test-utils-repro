# Vue Test Utils Peer dependency issue reproducers

## Yarn

When using yarn pnp or the pnpm linker for yarn, @vue/test-utils is unable to access @vue/compiler-dom because the peer dependency is not declared. Yarn treats this as unsound and ambiguous and fails, where as npm would silently allow this to work as long as _something_ somewhere installed _some version_ of that package.

To reproduce:
```bash
cd yarn
yarn install
yarn run test
```

## PNPM

When using pnpm, a similar behavior to npm is performed where dependencies will be hoisted to `./node_modules/.pnpm/node_modules/**` using symlinks. This is a compatibility shim to handle cases where undeclared dependencies are referenced. This solves the problem that the Yarn pnp / pnpm linkers had in that we are now able to find `@vue/compiler-dom`, however, it introduces another problem in that the version of `@vue/compiler-dom` being used isn't guaranteed to match the version of vue the package depends on when you are in a monorepo.

The pnpm reproducer makes use of a monorepo with two sub-packages that both reference different versions of vue. The tests expect that the version of `@vue/compiler-dom` used matches the version of vue and this will fail for one of the two packages. This may be the source of subtle bugs since there is now a mismatch between the `vue` version and the `@vue/compiler-dom` package.

```bash
cd pnpm
pnpm install
pnpm run test
```

## NPM 

When using npm, the hoisting behavior is different from pnpm when there is a conflict in the vue versions. With npm, one set of vue packages will be hoisted to the root, and the other set will be nested in `packages/b/node_modules`. In this case, the reproducer is providing a different set of errors and the test is failing trying to mount the component in vue internals for one of the two packages.

```bash
cd npm
npm install
npm run test
```
