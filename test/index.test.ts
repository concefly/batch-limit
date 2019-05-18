import * as assert from 'assert';
import BatchLimiter from '../src/index';

describe('BatchLimiter', () => {
  describe('memoryLoad', () => {
    [
      { freemem: 0, totalmem: 100, expect: 1 },
      { freemem: 50, totalmem: 100, expect: 0.5 },
      { freemem: 100, totalmem: 100, expect: 0 },
    ].map(spec => {
      it(`expect ${spec.expect}`, () => {
        const limiter = new BatchLimiter(
          {},
          {
            os: {
              freemem: () => spec.freemem,
              totalmem: () => spec.totalmem,
            } as any,
          }
        );

        assert.equal(limiter.getMemoryLoad(), spec.expect);
      });
    });
  });

  describe('getLimit', () => {
    [
      { min: 1, max: 10, memoryLoad: 0, expect: 10 },
      { min: 1, max: 10, memoryLoad: 0.5, expect: 5 },
      { min: 1, max: 10, memoryLoad: 1, expect: 1 },
    ].map(spec => {
      it(`expect ${spec.expect}`, () => {
        class BatchLimiterTest extends BatchLimiter {
          getMemoryLoad() {
            return spec.memoryLoad;
          }
        }

        const limiter = new BatchLimiterTest({
          min: spec.min,
          max: spec.max,
        });

        assert.equal(limiter.getLimit(), spec.expect);
      });
    });
  });
});
