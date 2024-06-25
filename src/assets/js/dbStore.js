class DBStorage {
    constructor(name) {
      this.db = ''
      this.dbName = name
      this._events_ = {}
      this.setTimers = {}
      this.setPromises = {}
    }
    // 打开db
    open(name) {
      return new Promise((resolve, reject) => {
        const openDB = window.indexedDB.open(name)
        openDB.onerror = function(error) {
          console.log(error.target.error.message)
          resolve(false)
        }
        openDB.onupgradeneeded = event => {
          const db = event.target.result
          const dbStorate = db.createObjectStore(name, { keyPath: 'id' })
          dbStorate.createIndex('value', 'value', { unique: true })
        }
        openDB.onsuccess = (event) => {
          const db = event.target.result
          this.db = db
          this.dbName = name
          resolve(this)
        }
      })
    }
    // 创建事务
    createTransaction(type = 'readwrite') {
      return this.db.transaction([this.dbName], type)
        .objectStore(this.dbName)
    }
    // 读取数据
    get(name) {
      return new Promise(async(resolve, reject) => {
        try {
          await this.open(this.dbName)
          const request = this.createTransaction('readonly').get(name)
          request.onerror = (error) => {
            console.log(error.target.error.message)
            resolve(false)
          }
          request.onsuccess = e => {
            resolve(e.target.result && e.target.result.value || null)
          }
        } catch(e) {
          resolve(null)
        }
      })
    }
    // 存储数据
    async set(name, value) {
      await this.remove(name)
      await this.add(name, value)
      this.$emit(name, value)
    }
    // 新增数据
    add(name, value) {
      return new Promise(async(resolve, reject) => {
        try {
          await this.open(this.dbName)
          const request = this.createTransaction().add({
            id: name,
            value
          })
          request.onsuccess = () => {
            resolve(this)
          }
          request.onerror = error => {
            console.log(error.target.error.message, name, '新增失败============')
            resolve(false)
          }
        } catch(e) {
          resolve(false)
        }
      })
    }
    // 删除数据
    remove(name) {
      return new Promise(async(resolve, reject) => {
        try {
          await this.open(this.dbName)
          const request = this.createTransaction().delete(name)
          request.onsuccess = () => {
            resolve(true)
          }
          request.onerror = error => {
            console.log(error.target.error.message, name, '删除失败========')
            resolve(false)
          }
        } catch(e) {
          resolve(false)
        }
      })
    }
    // 清空
    clear(noClearArr) {
      return new Promise(async(resolve, reject) => {
        try {
          const keys = await this.getAllKeys()
          let clearKeys = keys
          if (Array.isArray(noClearArr)) {
            clearKeys = keys.filter(e => !noClearArr.includes(e))
          }
          clearKeys.forEach(k => {
            this.remove(k)
          })
        } catch(e) {
          resolve(false)
        }
      })
    }
    // 获取所有keys
    getAllKeys() {
      return new Promise(async(resolve, reject) => {
        try {
          await this.open(this.dbName)
          const request = this.createTransaction().getAllKeys()
          request.onsuccess = () => {
            resolve(request.result)
          }
          request.onerror = error => {
            console.log(error.target.error.message)
            resolve([])
          }
        } catch(e) {
          resolve([])
        }

      })
    }
    // 监听数据变动
    watch(name, fn) {
      if (name && typeof fn === 'function') {
        if (!this._events_[name]) {
          this._events_[name] = []
        }
        this._events_[name].push(fn)
      }
      return () => {
        (this._events_[name] = this._events_[name].filter(e => e !== fn))
      }
    }
    $emit(name, value) {
      if (this._events_[name] && Array.isArray(this._events_[name])) {
        this._events_[name].forEach(fn => {
          fn(value);
        });
      }
    }
  }
  export default {
    install(App) {
      // 基本数据存储
      const dbStorage = new DBStorage('BASE_DATA_DB')
      App.prototype.dbStore = dbStorage
      window.dbStore = dbStorage
      // 自定义查询数据存储
      const defineSearchDb = new DBStorage('DEFINE_SEARCH_DB')
      App.prototype.defineSearchDb = defineSearchDb
      window.defineSearchDb = defineSearchDb
      // 自定义列数据存储
      const defineFieldDb = new DBStorage('DEFINE_FIELD_DB')
      App.prototype.defineFieldDb = defineFieldDb
      window.defineFieldDb = defineFieldDb
    }
  }