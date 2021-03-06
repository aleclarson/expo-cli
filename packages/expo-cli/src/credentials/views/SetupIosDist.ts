import { Context, IView } from '../context';
import * as iosDistView from './IosDistCert';

export class SetupIosDist implements IView {
  _experienceName: string;
  _bundleIdentifier: string;
  _nonInteractive: boolean;

  constructor(options: iosDistView.DistCertOptions) {
    const { experienceName, bundleIdentifier } = options;
    this._experienceName = experienceName;
    this._bundleIdentifier = bundleIdentifier;
    this._nonInteractive = options.nonInteractive ?? false;
  }

  async open(ctx: Context): Promise<IView | null> {
    if (!ctx.user) {
      throw new Error(`This workflow requires you to be logged in.`);
    }

    const configuredDistCert = await ctx.ios.getDistCert(
      this._experienceName,
      this._bundleIdentifier
    );

    if (configuredDistCert) {
      // we dont need to setup if we have a valid dist cert on file
      const isValid = await iosDistView.validateDistributionCertificate(ctx, configuredDistCert);
      if (isValid) {
        return null;
      }
    }

    return new iosDistView.CreateOrReuseDistributionCert({
      experienceName: this._experienceName,
      bundleIdentifier: this._bundleIdentifier,
      nonInteractive: this._nonInteractive,
    });
  }
}
