import {Service} from '../../models'

function create_service(name, pages=[]){
	let service = new Service({
		name: name,
		pages: pages
	})
	service.save((err, doc) => {
		if (!err)
			console.log('Service added successfully!')
		else
			console.log('Error during record insertion : ' + err)
  	});
}

export {create_service}