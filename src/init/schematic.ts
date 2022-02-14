import { noop, Rule } from '@angular-devkit/schematics';

/**
 * nx g @lubowiecki/ngx-schematics:init
 */
export default function (): Rule {
	return () => noop();
}
