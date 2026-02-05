import { GroupManager } from './managers/GroupManager'

const groupManager = new GroupManager()
groupManager.init().catch(console.error)
