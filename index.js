const EventEmitter = require('events');

class Core extends EventEmitter {
	constructor() {
		super();

		this.config = require('nodejs-config')(
			__dirname,
			function () {
				return process.env.NODE_ENV;
			}
		);
	}

	async initialize() {
		try {
			await Promise.all(Core.ENVIRONMENT.config.map(async (module) => {
				return await module.call(this).catch(console.error)
			}));

			await Promise.all(Core.ENVIRONMENT.plugins.map(async (module) => {
				return await module.call(this).catch(console.error)
			}));

			await Promise.all(Core.ENVIRONMENT.modules.map(async (module) => {
				return await module.call(this).catch(console.error)
			}));
		} catch (e) {
			console.error(e)
		}

		this.emit("ready");
		process.send('ready');
	}

	static async create(environment) {
		Core.ENVIRONMENT = environment;
		const o = new Core();
		await o.initialize();
		return o;
	}
}

module.exports = Core.create;