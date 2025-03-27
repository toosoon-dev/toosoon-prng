import prng from './prng';
import type { FolderApi as Folder, FolderParams, BindingApi as Binding, BindingParams } from '@tweakpane/core';

/**
 * Utility abstract class for generating pseudo-random values
 *
 * @class PRNGController
 * @abstract
 */
export abstract class PRNGController<T = unknown> {
  seed: string;
  abstract value: T;

  gui!: Binding;

  constructor(seed: string | number) {
    this.seed = `${seed}`;
    prng.addController(this);
  }

  addGUI(gui: Folder, params: BindingParams = {}) {
    this.gui = gui.addBinding(this, 'value', { label: this.seed, ...params });
    return this.gui;
  }

  abstract getValue(): T;

  dispose() {
    prng.removeController(this);
    this.gui?.dispose();
  }
}

/**
 * Utility abstract class for managing multiple instances of individual controllers
 *
 * @class PRNGGroupController
 * @abstract
 */
export abstract class PRNGGroupController<T = unknown> {
  seed: string;
  controllers: PRNGController<T>[] = [];

  gui!: Folder;
  guiParams!: BindingParams;

  constructor(seed: string | number) {
    this.seed = `${seed}`;
  }

  addGUI(gui: Folder, params: Partial<FolderParams> = {}): Folder {
    this.gui = gui.addFolder({ title: this.seed, expanded: false, ...params });
    this.guiParams = params;
    return this.gui;
  }

  abstract createController(index: number): PRNGController<T>;

  getValueAt(index: number): T {
    let controller = this.controllers[index];
    if (!controller) {
      controller = this.createController(index);
      if (this.gui) {
        controller.addGUI(this.gui, { label: `${this.gui.title}-${index}`, ...this.guiParams });
      }
      this.controllers[index] = controller;
    }
    return controller.value;
  }

  dispose() {
    this.controllers.forEach((controller) => controller.dispose());
    this.controllers = [];
    this.gui?.dispose();
  }
}

// *********************
// Controllers
// *********************

/**
 * Utility class for generating pseudo-random boolean value
 *
 * @exports
 * @class BooleanController
 * @extends PRNGController
 */
export class BooleanController extends PRNGController<boolean> {
  value: boolean;
  probability: number;

  constructor(seed: string | number, probability: number = 0.5) {
    super(seed);

    this.probability = probability;
    this.value = this.getValue();
  }

  getValue() {
    this.value = prng.randomBoolean(this.seed, this.probability);
    this.gui?.refresh();
    return this.value;
  }
}

/**
 * Utility class for generating pseudo-random sign value (-1 or 1)
 *
 * @exports
 * @class SignController
 * @extends PRNGController
 */
export class SignController extends PRNGController<number> {
  value: number;
  probability: number;

  constructor(seed: string | number, probability: number = 0.5) {
    super(seed);

    this.probability = probability;
    this.value = this.getValue();
  }

  addGUI(gui: Folder, params: Omit<BindingParams, 'options'> = {}) {
    return super.addGUI(gui, { options: [-1, 1], ...params });
  }

  getValue() {
    this.value = prng.randomSign(this.seed, this.probability);
    this.gui?.refresh();
    return this.value;
  }
}

/**
 * Utility class for generating pseudo-random floating-point number within a specified range
 *
 * @exports
 * @class FloatController
 * @extends PRNGController
 */
export class FloatController extends PRNGController<number> {
  value: number;
  min: number;
  max: number;

  constructor(seed: string | number, min: number = 0, max: number = 1) {
    super(seed);

    this.min = min;
    this.max = max;
    this.value = this.getValue();
  }

  addGUI(gui: Folder, { min, max, step = 0.01, ...params }: BindingParams = {}) {
    return super.addGUI(gui, { min, max, step, ...params });
  }

  getValue() {
    this.value = prng.randomFloat(this.seed, this.min, this.max);
    this.gui?.refresh();
    return this.value;
  }
}

/**
 * Utility class for generating pseudo-random integer number within a specified range
 *
 * @exports
 * @class IntController
 * @extends PRNGController
 */
export class IntController extends PRNGController<number> {
  value: number;
  min: number;
  max: number;

  constructor(seed: string | number, min: number, max: number) {
    super(seed);

    this.min = min;
    this.max = max;
    this.value = prng.randomInt(this.seed, min, max);
  }

  addGUI(gui: Folder, { min, max, step = 1, ...params }: BindingParams = {}) {
    return super.addGUI(gui, { min, max, step, ...params });
  }

  getValue() {
    this.value = prng.randomInt(this.seed, this.min, this.max);
    this.gui?.refresh();
    return this.value;
  }
}

/**
 * Utility class for generating pseudo-random hexadecimal color
 *
 * @exports
 * @class HexColorController
 * @extends PRNGController
 */
export class HexColorController extends PRNGController<string> {
  value: string;

  constructor(seed: string | number) {
    super(seed);

    this.value = this.getValue();
  }

  addGUI(gui: Folder, { view = 'color', ...params }: BindingParams = {}) {
    return super.addGUI(gui, { view, ...params });
  }

  getValue() {
    this.value = prng.randomHexColor(this.seed);
    this.gui?.refresh();
    return this.value;
  }
}

/**
 * Utility class for picking a pseudo-random item from a given array
 *
 * @exports
 * @class ItemController
 * @extends PRNGController
 */
export class ItemController<T = unknown> extends PRNGController<T> {
  value: T;
  items: T[];

  constructor(seed: string | number, items: T[]) {
    super(seed);

    this.items = items;
    this.value = this.getValue();
  }

  addGUI(gui: Folder, params: Omit<BindingParams, 'options'> = {}) {
    return super.addGUI(gui, { options: this.items, ...params });
  }

  getValue() {
    this.value = prng.randomItem<T>(this.seed, this.items) as T;
    this.gui?.refresh();
    return this.value;
  }
}

/**
 * Utility class for picking a pseudo-random property value from a given object
 *
 * @exports
 * @class ObjectPropertyController
 * @extends PRNGController
 */
export class ObjectPropertyController<T = unknown> extends PRNGController<T> {
  value: T;
  object: Record<string, T>;

  constructor(seed: string | number, object: Record<string, T>) {
    super(seed);

    this.object = object;
    this.value = this.getValue();
  }

  addGUI(gui: Folder, params: Omit<BindingParams, 'options'> = {}) {
    return super.addGUI(gui, { options: this.object, ...params });
  }

  getValue() {
    this.value = prng.randomObjectProperty<T>(this.seed, this.object) as T;
    this.gui?.refresh();
    return this.value;
  }
}

type WeightsItems<T> = Array<{ weight: number; value: T }>;

/**
 * Utility class for selecting a pseudo-random index from an array of weighted items
 *
 * @exports
 * @class WeightsController
 * @extends PRNGController
 */
export class WeightsController<T = unknown> extends PRNGController<T> {
  value: T;
  items: WeightsItems<T>;
  weights: number[];

  constructor(seed: string | number, items: WeightsItems<T>) {
    super(seed);

    this.items = items;
    this.weights = this.items.map((item) => item.weight);
    this.value = this.getValue();
  }

  addGUI(gui: Folder, params: Omit<BindingParams, 'options'> = {}) {
    return super.addGUI(gui, { options: this.items.map((item) => item.value), ...params });
  }

  getValue() {
    const index = prng.randomIndex(this.seed, this.weights);
    this.value = this.items[index].value;
    this.gui?.refresh();
    return this.value;
  }
}

/**
 * Utility class for generating a pseudo-random number fitting a Gaussian (normal) distribution
 *
 * @exports
 * @class GaussianController
 * @extends PRNGController
 */
export class GaussianController extends PRNGController<number> {
  value: number;
  mean: number;
  spread: number;

  constructor(seed: string | number, mean: number = 0, spread = 1) {
    super(seed);

    this.mean = mean;
    this.spread = spread;
    this.value = this.getValue();
  }

  addGUI(
    gui: Folder,
    { min = this.mean - this.spread, max = this.mean + this.spread, step, ...params }: BindingParams = {}
  ) {
    return super.addGUI(gui, { min, max, step, ...params });
  }

  getValue() {
    this.value = prng.randomGaussian(this.seed, this.mean, this.spread);
    this.gui?.refresh();
    return this.value;
  }
}

// *********************
// Group Controllers
// *********************

/**
 * Utility class for managing multiple `BooleanController`
 *
 * @exports
 * @class BooleanGroupController
 * @extends PRNGGroupController
 */
export class BooleanGroupController extends PRNGGroupController<boolean> {
  probability: number;
  controllers: BooleanController[] = [];

  constructor(seed: string | number, probability: number) {
    super(seed);

    this.probability = probability;
  }

  createController(index: number) {
    return new BooleanController(`${this.seed}-${index}`, this.probability);
  }
}

/**
 * Utility class for managing multiple `SignController`
 *
 * @exports
 * @class SignGroupController
 * @extends PRNGGroupController
 */
export class SignGroupController extends PRNGGroupController<number> {
  probability: number;
  controllers: SignController[] = [];

  constructor(seed: string | number, probability: number) {
    super(seed);

    this.probability = probability;
  }

  createController(index: number) {
    return new SignController(`${this.seed}-${index}`, this.probability);
  }
}

/**
 * Utility class for managing multiple `FloatController`
 *
 * @exports
 * @class FloatGroupController
 * @extends PRNGGroupController
 */
export class FloatGroupController extends PRNGGroupController<number> {
  min: number;
  max: number;
  controllers: FloatController[] = [];

  constructor(seed: string | number, min: number, max: number) {
    super(seed);

    this.min = min;
    this.max = max;
  }

  createController(index: number) {
    return new FloatController(`${this.seed}-${index}`, this.min, this.max);
  }
}

/**
 * Utility class for managing multiple `IntController`
 *
 * @exports
 * @class IntGroupController
 * @extends PRNGGroupController
 */
export class IntGroupController extends PRNGGroupController<number> {
  min: number;
  max: number;
  controllers: IntController[] = [];

  constructor(seed: string | number, min: number, max: number) {
    super(seed);

    this.min = min;
    this.max = max;
  }

  createController(index: number) {
    return new IntController(`${this.seed}-${index}`, this.min, this.max);
  }
}

/**
 * Utility class for managing multiple `HexColorController`
 *
 * @exports
 * @class HexColorGroupController
 * @extends PRNGGroupController
 */
export class HexColorGroupController extends PRNGGroupController<string> {
  controllers: HexColorController[] = [];

  // constructor(seed: string | number) {
  //   super(seed);
  // }

  createController(index: number) {
    return new HexColorController(`${this.seed}-${index}`);
  }
}

/**
 * Utility class for managing multiple `ItemController`
 *
 * @exports
 * @class ItemGroupController
 * @extends PRNGGroupController
 */
export class ItemGroupController<T = unknown> extends PRNGGroupController<T> {
  items: T[];
  controllers: ItemController<T>[] = [];

  constructor(seed: string | number, items: T[]) {
    super(seed);

    this.items = items;
  }

  createController(index: number) {
    return new ItemController<T>(`${this.seed}-${index}`, this.items);
  }
}

/**
 * Utility class for managing multiple `ObjectPropertyController`
 *
 * @exports
 * @class ObjectPropertyGroupController
 * @extends PRNGGroupController
 */
export class ObjectPropertyGroupController<T = unknown> extends PRNGGroupController<T> {
  object: Record<string, T>;
  controllers: ObjectPropertyController<T>[] = [];

  constructor(seed: string | number, object: Record<string, T>) {
    super(seed);

    this.object = object;
  }

  createController(index: number) {
    return new ObjectPropertyController<T>(`${this.seed}-${index}`, this.object);
  }
}

/**
 * Utility class for managing multiple `WeightsController`
 *
 * @exports
 * @class WeightsGroupController
 * @extends PRNGGroupController
 */
export class WeightsGroupController<T = unknown> extends PRNGGroupController<T> {
  items: WeightsItems<T>;
  controllers: WeightsController<T>[] = [];

  constructor(seed: string | number, items: WeightsItems<T>) {
    super(seed);

    this.items = items;
  }

  createController(index: number) {
    return new WeightsController<T>(`${this.seed}-${index}`, this.items);
  }
}

/**
 * Utility class for managing multiple `GaussianController`
 *
 * @exports
 * @class GaussianGroupController
 * @extends PRNGGroupController
 */
export class GaussianGroupController extends PRNGGroupController<number> {
  controllers: GaussianController[] = [];
  mean: number;
  spread: number;

  constructor(seed: string | number, mean: number = 0, spread: number = 1) {
    super(seed);

    this.mean = mean;
    this.spread = spread;
  }

  createController(index: number) {
    return new GaussianController(`${this.seed}-${index}`, this.mean, this.spread);
  }
}
