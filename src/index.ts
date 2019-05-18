export interface IConfig {
  min: number;
  max: number;
}

export interface IDep {
  os: typeof import('os');
}

class BatchLimiter {
  private config: IConfig = {
    min: 1,
    max: Infinity,
  };

  private dep: IDep = {
    os: require('os'),
  };

  constructor(config?: Partial<IConfig>, dep?: Partial<IDep>) {
    Object.assign(this.config, config);
    Object.assign(this.dep, dep);

    if (this.config.max < this.config.min) throw new Error('MAX mast be greater the MIN');
  }

  /** 内存负载 (0, 1] */
  getMemoryLoad(): number {
    const { os } = this.dep;

    const free = os.freemem();
    const total = os.totalmem();

    return (total - free) / total;
  }

  getLimit(): number {
    const { min, max } = this.config;

    const memoryLoad = this.getMemoryLoad();

    return Math.floor(min + (max - min) * (1 - memoryLoad));
  }
}

export default BatchLimiter;
