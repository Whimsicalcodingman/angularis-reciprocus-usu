import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { Weather } from './weather';

describe('Weather', () => {
  let spectator: Spectator<Weather>;
  const createComponent = createComponentFactory(Weather);

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(createComponent).toBeTruthy();
  });
});
