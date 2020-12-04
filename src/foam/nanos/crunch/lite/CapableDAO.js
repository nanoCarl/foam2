/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.crunch.lite',
  name: 'CapableDAO',
  extends: 'foam.dao.ProxyDAO',

  javaImports: [
    'foam.core.FObject',
    'foam.dao.DAO',
    'foam.util.SafetyUtil',
    'foam.nanos.crunch.lite.Capable',
    'foam.nanos.crunch.lite.CapablePayload',
    'foam.nanos.crunch.Capability',
    'java.util.Arrays',
    'java.util.ArrayList',
    'java.util.List'
  ],

  properties: [
    {
      class: 'String',
      name: 'daoKey'
    },
    {
      class: 'Enum',
      name: 'defaultStatus',
      of: 'foam.nanos.crunch.CapabilityJunctionStatus',
      value: foam.nanos.crunch.CapabilityJunctionStatus.ACTION_REQUIRED
    }
  ],

  methods: [
    {
      name: 'put_',
      javaCode: `
        FObject currentObjectInDao = getDelegate().find_(x, obj);
        Capable toPutCapableObj =  (Capable) obj;
        DAO toPutCapablePayloadDAO = toPutCapableObj.getCapablePayloadDAO(x);

        CapablePayload[] toPutCapablePayloadArray = (CapablePayload[]) toPutCapableObj.getCapablePayloads();

        // For both create and update,
        // we need to handle the cleaning of data if it is from the client
        // and we also need to populate the CapablePayload.daoKey and 
        // CapablePayload.objId fields since they don't get filled out by client
        if ( currentObjectInDao == null ) {
          for (int i = 0; i < toPutCapablePayloadArray.length; i++){

            toPutCapableObj.setDaoKey(getDaoKey());
        
            CapablePayload currentCapablePayload = toPutCapablePayloadArray[i];

            if ( ! currentCapablePayload.getHasSafeStatus() ){
              currentCapablePayload.setStatus(getDefaultStatus());
            }
          }          
        } else {
          Capable storedCapableObj = (Capable) currentObjectInDao;

          toPutCapableObj.setDaoKey(storedCapableObj.getDaoKey());
          
          // should always be sync'd with whatever is on the backend
          if ( 
            SafetyUtil.isEmpty(String.valueOf(storedCapableObj.getDaoKey())) 
          ) {
            toPutCapableObj.setDaoKey(getDaoKey());
          }

          DAO storedCapablePayloadDAO = storedCapableObj.getCapablePayloadDAO(x);

          for ( int i = 0; i < toPutCapablePayloadArray.length; i++ ){
            CapablePayload toPutCapablePayload = (CapablePayload) toPutCapablePayloadArray[i];

            if ( ! toPutCapablePayload.getHasSafeStatus() ){

              DAO capabilityDAO = (DAO) x.get("capabilityDAO");
              Capability capability = (Capability) capabilityDAO.find(toPutCapablePayload.getCapability());

              CapablePayload storedCapablePayload = (CapablePayload) storedCapablePayloadDAO.find(capability.getId());

              if ( storedCapablePayload != null ){
                toPutCapablePayload.setStatus(storedCapablePayload.getStatus());
              }
            }
          }
        }

        List<CapablePayload> capablePayloads = new ArrayList<CapablePayload>(Arrays.asList(toPutCapablePayloadArray));

        for ( CapablePayload currentPayload : capablePayloads ){
          toPutCapablePayloadDAO.put(currentPayload);
        }

        return super.put_(x, obj);
      `
    }
  ],
});
