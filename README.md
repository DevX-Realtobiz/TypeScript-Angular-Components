# TypeScript-Angular-Components
Contains various TypeScript Angular controls and components.

<img src="http://build.renovolive.com/app/rest/builds/buildType:(id:TypeScriptProjects_TypeScriptAngularComponents_BuildAndTest)/statusIcon"/>

## Behaviors
Angular directives that are applied as attributes to an element in order to modify the element's behavior.

* [alias](/source/behavior/alias/alias.md)
* [autosave](/source/behaviors/autosave/autosave.md)
* [popover](/source/behavior/popover/popover.md)
* [required](/source/behaviors/required/required.md)

## Components
Angular components that can be added to an application.

### [Buttons](/source/components/button/buttons.md)

* [button](/source/components/button/button.md)
* [buttonAsync](/source/components/buttonAsync/buttonAsync.md)
* [buttonLink](/source/components/buttonLink/buttonLink.md)
* [buttonSubmit](/source/components/buttonSubmit/buttonSubmit.md)
* [buttonToggle](/source/components/buttonToggle/buttonToggle.md)
* [longClickButton]()

### [Inputs](/source/components/input/input.md)

* [checkbox]()
* [dateTime](/source/components/dateTime/dateTime.md)
* [radio]()
* [richTextEditor]()
* [select](/source/components/select/select.md)
* [spinner](/source/components/spinner/spinner.md)
* [textarea](/source/components/textarea/textarea.md)
* [textbox](/source/components/textbox/textbox.md)
* [typeahead](/source/components/typeahead/typeahead.md)
* [typeaheadList]()

### Other
* [busy](/source/components/busy/busy.md)
* [cardContainer]()
* [commaList]()
* [dateTimeStatic]()
* [dialog]()
* [genericContainer]()
* [form](/source/components/form/form.md)
* [lazyLoad](/source/components/lazyLoad/lazyLoad.md)
* [messageLog]()
* [multiStepIndicator]()
* [ratingBar]()
* [signaturePad]()
* [simpleCardList]()
* [stringWithWatermark]()
* [tabs]()
* [templateRenderer]()
* [userRating]()
* [validationGroup]()

## Services
Visual utilities and services for open modals and performing other UI tasks.

* [autosave]()
* [autosaveAction]()
* [autosaveDialog]()
* [breakpoints]()
* [componentValidator]()
* [contentProvider]()
* [dialog]()
* [documentWrapper]()
* [jquery]()
* [templateLoader]()
* [windowWrapper]()

## Types


## Building and Testing
Please always test new builds to ensure non-breaking commits and PRs

The primary build scripts are:
### `npm run update`
Installs external libraries and dependencies. Should be run after pulling down code changes.

### `npm run build`
Compiles TypeScript files into JavaScript.

### `npm test` or `npm run test`
Runs the tests.

Use `npm run test.debug` to debug test failures.
`npm run test.tc` uses the TeamCity reporter to print out results for TeamCity.
`npm run test.full` runs the tests in multiple browsers instead of Chrome alone.

### `npm run bundle`
Bundle all of the javascript files together and put in the output folder.

### Combinations
In addition, there are some useful combination tasks:
`npm run update-build`
`npm run build-test`

To perform a full build from scratch, including `update`, `build`, `bundle`, run:
`npm run full-build`

### Watch
Several tasks can be modified with `.watch` in order to watch the file system for changes:
`npm run build.watch`
`npm run build-bundle.watch`
`npm run build-test.watch`

In general, `-` is used to indicate combined / joint tasks; `.` is used to indicate a subtask or a modification or variation of a task.