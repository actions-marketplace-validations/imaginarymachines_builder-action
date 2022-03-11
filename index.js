const core = require("@actions/core");
const pluginMachine = require("plugin-machine").default;

// most @actions toolkit packages have async methods
async function run() {
	const { createDockerApi, builder } = pluginMachine;
	const pmDockerApi = await createDockerApi({});
	const pluginDir = __dirname;
	const pluginMachineJson = pluginMachine.getPluginMachineJson(
		pluginDir,
		//Optional ovverides
		{}
	);

	const { buildPlugin, copyBuildFiles, zipDirectory } = builder;

	let outputDir = "output";
	try {
		await buildPlugin(pluginMachineJson, "prod", pmDockerApi).then(() =>
			console.log("built!")
		);

		await copyBuildFiles(
			pluginMachineJson,
			`/${outputDir}`, //subdir of plugin dir to copy file to,
			pluginDir //plugin root directory
		).then(() => console.log("copied!"));

		await zipDirectory(
			`${pluginDir}/${outputDir}`,
			pluginMachineJson.slug
		).then(() => console.log("zipped!"));

		core.info(new Date().toTimeString());

		core.setOutput("time", new Date().toTimeString());
	} catch (error) {
		core.setFailed(error.message);
	}
}

run();
