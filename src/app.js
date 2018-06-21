const EventEmitter = require('events');

class Core extends EventEmitter {
	constructor() {
		super();

		this.config = require('nodejs-config')(
			__dirname,
			function()
			{
				return process.env.NODE_ENV;
			}
		);
	}

	async initialize() {
		await Promise.all(require('./plugins').map(async (module) => {
			return await module.call(this).catch(console.error)
		}));

		await Promise.all(require('./modules').map(async (module) => {
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