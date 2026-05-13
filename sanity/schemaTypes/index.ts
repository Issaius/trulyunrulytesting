import { type SchemaTypeDefinition } from 'sanity';
import { aboutPage } from './aboutPage';
import { homeSlider } from './homeSlider';
import { portfolio } from './portfolio';

export const schemaTypes: SchemaTypeDefinition[] = [homeSlider, portfolio, aboutPage];
