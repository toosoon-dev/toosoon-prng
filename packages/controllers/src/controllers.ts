import prng from './prng';
import type { FolderApi as Folder, FolderParams, BindingApi as Binding, BindingParams } from '@tweakpane/core';

export interface PRNGController<T = unknown> {
  seed: string;
  value: T;
  addGUI(gui: Folder, params?: BindingParams): Binding;
  getValue(): T;
  dispose(): void;
}

export interface PRNGGroupController<T = unknown> {
  seed: string;
  addGUI(gui: Folder, params?: Partial<FolderParams>): Folder;
  createController(index: number): PRNGController<T>;
  getValueAt(index: number): T;
  dispose(): void;
}

/**
 * Utility abstract class for generating pseudo-random values
 *
 * @class BasePRNGController
 * @implements PRNGController
 * @abstract
 */
abstract class BasePRNGController<T> implements PRNGController<T> {
  seed: string;
  abstract value: T;
  gui!: Binding;

  constructor(seed: string) {
    this.seed = seed;
    prng.addController(this);
  }

  abstract addGUI(gui: Folder, params?: BindingParams): Binding;

  abstract getValue(): T;

  dispose() {
    prng.removeController(this);
    this.gui?.dispose();
  }
}

/**
 * Utility abstract class for managing multiple instances of individual controllers
 *
 * @class BasePRNGGroupController
 * @implements PRNGGroupController
 * @abstract
 */
abstract class BasePRNGGroupController<T> implements PRNGGroupController<T> {
  seed: string;
  controllers: PRNGController<T>[] = [];
  gui!: Folder;
  guiParams!: BindingParams;

  constructor(seed: string) {
    this.seed = seed;
  }

  addGUI(gui: Folder, params: Partial<FolderParams> = {}) {
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

  get title() {
    return this.seed;
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
 * @extends BasePRNGController
 */
export class BooleanController extends BasePRNGController<boolean> {
  value: boolean;
  probability: number;

  constructor(seed: string, probability: number = 0.5) {
    super(seed);

    this.probability = probability;
    this.value = this.getValue();
  }

  addGUI(gui: Folder, params: BindingParams = {}) {
    this.gui = gui.addBinding(this, 'value', { label: this.seed, ...params });
    return this.gui;
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
 * @extends BasePRNGController
 */
export class SignController extends BasePRNGController<number> {
  value: number;
  probability: number;

  constructor(seed: string, probability: number = 0.5) {
    super(seed);

    this.probability = probability;
    this.value = this.getValue();
  }

  addGUI(gui: Folder, params: Omit<BindingParams, 'options'> = {}) {
    this.gui = gui.addBinding(this, 'value', { label: this.seed, options: [-1, 1], ...params });
    return this.gui;
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
 * @extends BasePRNGController
 */
export class FloatController extends BasePRNGController<number> {
  value: number;
  min: number;
  max: number;

  constructor(seed: string, min: number = 0, max: number = 1) {
    super(seed);

    this.min = min;
    this.max = max;
    this.value = this.getValue();
  }

  addGUI(gui: Folder, { min, max, step = 0.01, ...params }: BindingParams = {}) {
    this.gui = gui.addBinding(this, 'value', { label: this.seed, min, max, step, ...params });
    return this.gui;
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
 * @extends BasePRNGController
 */
export class IntController extends BasePRNGController<number> {
  value: number;
  min: number;
  max: number;

  constructor(seed: string, min: number, max: number) {
    super(seed);

    this.min = min;
    this.max = max;
    this.value = prng.randomInt(this.seed, min, max);
  }

  addGUI(gui: Folder, { min, max, step = 1, ...params }: BindingParams = {}) {
    this.gui = gui.addBinding(this, 'value', { label: this.seed, min, max, step, ...params });
    return this.gui;
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
 * @extends BasePRNGController
 */
export class HexColorController extends BasePRNGController<string> {
  value: string;

  constructor(seed: string) {
    super(seed);

    this.value = this.getValue();
  }

  addGUI(gui: Folder, { view = 'color', ...params }: BindingParams = {}) {
    this.gui = gui.addBinding(this, 'value', { label: this.seed, view, ...params });
    return this.gui;
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
 * @extends BasePRNGController
 */
export class ItemController<T = unknown> extends BasePRNGController<T> {
  value: T;
  items: T[];

  constructor(seed: string, items: T[]) {
    super(seed);

    this.items = items;
    this.value = this.getValue();
  }

  addGUI(gui: Folder, params: Omit<BindingParams, 'options'> = {}) {
    this.gui = gui.addBinding(this, 'value', { label: this.seed, options: this.items, ...params });
    return this.gui;
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
 * @extends BasePRNGController
 */
export class ObjectPropertyController<T = unknown> extends BasePRNGController<T> {
  value: T;
  object: Record<string, T>;

  constructor(seed: string, object: Record<string, T>) {
    super(seed);

    this.object = object;
    this.value = this.getValue();
  }

  addGUI(gui: Folder, params: Omit<BindingParams, 'options'> = {}) {
    this.gui = gui.addBinding(this, 'value', { label: this.seed, options: this.object, ...params });
    return this.gui;
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
 * @extends BasePRNGController
 */
export class WeightsController<T = unknown> extends BasePRNGController<T> {
  value: T;
  items: WeightsItems<T>;
  weights: number[];

  constructor(seed: string, items: WeightsItems<T>) {
    super(seed);

    this.items = items;
    this.weights = this.items.map((item) => item.weight);
    this.value = this.getValue();
  }

  addGUI(gui: Folder, params: Omit<BindingParams, 'options'> = {}) {
    this.gui = gui.addBinding(this, 'value', {
      label: this.seed,
      options: this.items.map((item) => item.value),
      ...params
    });
    return this.gui;
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
 * @extends BasePRNGController
 */
export class GaussianController extends BasePRNGController<number> {
  value: number;
  mean: number;
  spread: number;

  constructor(seed: string, mean: number = 0, spread = 1) {
    super(seed);

    this.mean = mean;
    this.spread = spread;
    this.value = this.getValue();
  }

  addGUI(
    gui: Folder,
    { min = this.mean - this.spread, max = this.mean + this.spread, step, ...params }: BindingParams = {}
  ) {
    this.gui = gui.addBinding(this, 'value', { label: this.seed, min, max, step, ...params });
    return this.gui;
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
 * @extends BasePRNGGroupController
 */
export class BooleanGroupController extends BasePRNGGroupController<boolean> {
  probability: number;
  controllers: BooleanController[] = [];

  constructor(seed: string, probability: number) {
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
 * @extends BasePRNGGroupController
 */
export class SignGroupController extends BasePRNGGroupController<number> {
  probability: number;
  controllers: SignController[] = [];

  constructor(seed: string, probability: number) {
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
 * @extends BasePRNGGroupController
 */
export class FloatGroupController extends BasePRNGGroupController<number> {
  min: number;
  max: number;
  controllers: FloatController[] = [];

  constructor(seed: string, min: number, max: number) {
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
 * @extends BasePRNGGroupController
 */
export class IntGroupController extends BasePRNGGroupController<number> {
  min: number;
  max: number;
  controllers: IntController[] = [];

  constructor(seed: string, min: number, max: number) {
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
 * @extends BasePRNGGroupController
 */
export class HexColorGroupController extends BasePRNGGroupController<string> {
  controllers: HexColorController[] = [];

  // constructor(seed: string) {
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
 * @extends BasePRNGGroupController
 */
export class ItemGroupController<T = unknown> extends BasePRNGGroupController<T> {
  items: T[];
  controllers: ItemController<T>[] = [];

  constructor(seed: string, items: T[]) {
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
 * @extends BasePRNGGroupController
 */
export class ObjectPropertyGroupController<T = unknown> extends BasePRNGGroupController<T> {
  object: Record<string, T>;
  controllers: ObjectPropertyController<T>[] = [];

  constructor(seed: string, object: Record<string, T>) {
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
 * @extends BasePRNGGroupController
 */
export class WeightsGroupController<T = unknown> extends BasePRNGGroupController<T> {
  items: WeightsItems<T>;
  controllers: WeightsController<T>[] = [];

  constructor(seed: string, items: WeightsItems<T>) {
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
 * @extends BasePRNGGroupController
 */
export class GaussianGroupController extends BasePRNGGroupController<number> {
  controllers: GaussianController[] = [];
  mean: number;
  spread: number;

  constructor(seed: string, mean: number = 0, spread: number = 1) {
    super(seed);

    this.mean = mean;
    this.spread = spread;
  }

  createController(index: number) {
    return new GaussianController(`${this.seed}-${index}`, this.mean, this.spread);
  }
}
