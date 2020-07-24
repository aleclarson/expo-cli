import { UserManager } from '@expo/xdl';

import log from '../../../log';
import * as UrlUtils from '../../utils/url';
import { printTableJsonArray } from '../../utils/cli-table';
import { BuildInfo } from '../build';

function printBuildTable(builds: BuildInfo[]) {
  const headers = ['platform', 'status', 'artifacts'];
  const colWidths = [10, 15, 80];
  const refactoredBuilds = builds.map(build => ({
    ...build,
    artifacts: build.artifacts?.buildUrl ?? 'not available',
  }));
  const buildTable = printTableJsonArray(headers, refactoredBuilds, colWidths);
  console.log(buildTable);
}

async function printLogsUrls(
  accountName: string,
  builds: Array<{ platform: 'android' | 'ios'; buildId: string }>
): Promise<void> {
  const user = await UserManager.ensureLoggedInAsync();
  if (builds.length === 1) {
    const { buildId } = builds[0];
    const logsUrl = UrlUtils.constructBuildLogsUrl({
      buildId,
      username: accountName,
      v2: true,
    });
    log(`Logs url: ${logsUrl}`);
  } else {
    builds.forEach(({ buildId, platform }) => {
      const logsUrl = UrlUtils.constructBuildLogsUrl({
        buildId,
        username: user.username,
        v2: true,
      });
      log(`Platform: ${platform}, Logs url: ${logsUrl}`);
    });
  }
}

async function printBuildResults(buildInfo: Array<BuildInfo | null>): Promise<void> {
  if (buildInfo.length === 1) {
    log(`Artifact url: ${buildInfo[0]?.artifacts?.buildUrl ?? ''}`);
  } else {
    buildInfo
      .filter(i => i?.status === 'finished')
      .forEach(build => {
        log(`Platform: ${build?.platform}, Artifact url: ${build?.artifacts?.buildUrl ?? ''}`);
      });
  }
}

export { printBuildTable, printLogsUrls, printBuildResults };
