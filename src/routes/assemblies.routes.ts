import { Router } from 'express'
import { createAssembly } from '../controllers/assemblies.controllers';

const assemblyRouter = Router();
assemblyRouter.post('/api/assembly', createAssembly)


export default assemblyRouter;