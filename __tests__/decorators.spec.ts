
import 'mocha';
import { expect } from 'chai';
import { A, B } from './mocks/mocks';
import { IS_INJECTABLE, CLASS_INJECTIONS, CONTAINER_KEYS } from '../src/ioc/constants';
import { injectable } from '../src/ioc/decorators/injectable';

describe('Decorator tests', () => {
  it('should decorate class with injectable', () => {
    expect(Reflect.getOwnMetadata(IS_INJECTABLE, A)).to.be.true;
  });

  it('should define class injects to empty', () => {
    expect(Reflect.getOwnMetadata(CLASS_INJECTIONS, B)).to.be.empty;
  });

  it('should have empty container keys', () => {
    @injectable
    class NewClass {
      constructor() {
      }
    }
    expect(Reflect.getOwnMetadata(CONTAINER_KEYS, NewClass)).to.be.empty;
  });
});
