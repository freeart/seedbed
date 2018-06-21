const EventEmitter = require('events');

class Core extends EventEmitter {
	constructor(env) {
		super();

		this.config = require('nodejs-config')(
			__dirname,
			function()
			{
				return process.env.NODE_ENV;
			}
		);

		this.env = env;
	}

	async initialize() {
		await Promise.all(this.env.config.map(async (module) => {
			return await module.call(this).catch(console.error)
		}));

		await Promise.all(this.env.plugins.map(async (module) => {
			return await module.call(this).catch(console.error)
		}));

		await Promise.all(this.env.modules.map(async (module) => {
			return await module.call(this).catch(console.error)
		}));

		this.emit("ready");
	}

	static async create() {
		const o = new Core();
		await o.initialize();
		return o;
	}
}

Core.create();