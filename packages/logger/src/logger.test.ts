import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { getLogger } from './logger';

use(sinonChai);

let nodeEnv: string | undefined;

describe('Test logger', () => {
  beforeEach(() => {
    sinon.spy(console, 'info');
    sinon.spy(console, 'error');
    nodeEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    sinon.restore();
    process.env.NODE_ENV = nodeEnv;
  });

  it('should use the right logger on dev', () => {
    process.env.NODE_ENV = 'test';

    const logger = getLogger();

    logger.info('some string');
    logger.info({ an: 'object' }, 'and string');

    expect(console.info).is.calledWith('some string');
    expect(console.info).is.calledWith({ an: 'object' }, 'and string');
  });

  it('should use the right logger on production', () => {
    process.env.NODE_ENV = 'production';

    const logger = getLogger();

    logger.error('some string');
    logger.error({ an: 'object' }, 'and string');

    expect(console.error).is.calledWith('["some string"]');
    expect(console.error).is.calledWith('[{"an":"object"},"and string"]');
  });
});
