import { flags as flagParser } from '@oclif/command';
import BaseCommand from '../../base';
export default class UpgradeCommand extends BaseCommand {
    static args: {
        name: string;
        description: string;
        required: boolean;
    }[];
    static description: string;
    static examples: string[];
    static flags: {
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        pretty: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'phaeton-version': flagParser.IOptionFlag<string | undefined>;
        'release-url': flagParser.IOptionFlag<string | undefined>;
    };
    run(): Promise<void>;
}
