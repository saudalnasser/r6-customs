import 'dotenv/config';
import config from './config';
import { createColors } from 'colorette';

config.validate();

createColors({ useColor: true });
